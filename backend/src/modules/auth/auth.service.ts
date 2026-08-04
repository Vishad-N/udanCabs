import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.admin.count();
      if (count === 0) {
        const email = process.env.ADMIN_EMAIL || 'admin@udancabs.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123@password';
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.admin.create({
          data: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: 'ADMIN',
          },
        });
        this.logger.log(`Seeded initial admin account: ${email}`);
      }
    } catch (error) {
      this.logger.error('Failed to check/seed admin user on startup', error);
    }
  }

  async login(loginDto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(admin.id, admin.email, admin.role);
    await this.updateRefreshToken(admin.id, tokens.refreshToken);

    const { password, refreshToken, ...adminInfo } = admin;
    return {
      user: adminInfo,
      ...tokens,
    };
  }

  async refreshToken(userId: string, rt: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(admin.id, admin.email, admin.role);
    await this.updateRefreshToken(admin.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.admin.updateMany({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: {
        refreshToken: null,
      },
    });
    return { loggedOut: true };
  }

  async getProfile(userId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('User not found');
    }

    return admin;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'super-secret-refresh-key-change-in-production',
        expiresIn: '7d' as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.admin.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
