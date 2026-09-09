const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/admin/components/modals/BookingDetailsModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /import \{ AssignDriverModal \} from '\.\/AssignDriverModal';/,
  `import { AssignDriverModal } from './AssignDriverModal';\nimport { ConfirmTourModal } from './ConfirmTourModal';`
);

content = content.replace(
  /const \[isAssignModalOpen, setIsAssignModalOpen\] = useState\(false\);/,
  `const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);\n  const [isConfirmTourOpen, setIsConfirmTourOpen] = useState(false);`
);

// Add ConfirmTourModal to the render output right before AssignDriverModal
const assignDriverModalRegex = /<AssignDriverModal/;
const confirmTourModalCode = `<ConfirmTourModal
        isOpen={isConfirmTourOpen}
        onClose={() => setIsConfirmTourOpen(false)}
        booking={booking}
        onSuccess={() => {
          onUpdate();
        }}
      />
      <AssignDriverModal`;
content = content.replace(assignDriverModalRegex, confirmTourModalCode);

// Update Quick Status Action Controls to use Confirm Tour for TOUR bookings
const actionControlsRegex = /<button\s*onClick=\{\(\) => handleStatusUpdate\('CONFIRMED'\)\}\s*disabled=\{loading \|\| booking\.status === 'CONFIRMED'\}\s*className="py-2\.5 px-3 rounded-xl bg-emerald-600\/20 text-emerald-400 hover:bg-emerald-600\/30 border border-emerald-600\/30 text-xs font-bold transition-all disabled:opacity-40"\s*>\s*Confirm Ride\s*<\/button>/;

const newConfirmButtonCode = `{booking.bookingType === 'TOUR' ? (
                    <button
                      onClick={() => setIsConfirmTourOpen(true)}
                      disabled={loading || booking.status === 'CONFIRMED'}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30 text-xs font-bold transition-all disabled:opacity-40"
                    >
                      Confirm Tour
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate('CONFIRMED')}
                      disabled={loading || booking.status === 'CONFIRMED'}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30 text-xs font-bold transition-all disabled:opacity-40"
                    >
                      Confirm Ride
                    </button>
                  )}`;

content = content.replace(actionControlsRegex, newConfirmButtonCode);

fs.writeFileSync(filePath, content);
console.log('Update complete.');
