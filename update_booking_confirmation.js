const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/client/components/modals/BookingConfirmationModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Header Text & Subtext replacement
const headerRegex = /<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">\s*Booking Confirmed!\s*<\/h2>\s*<p className="text-sm text-muted-foreground mt-1">\s*Your ride request has been saved and sent to our dispatch team\.\s*<\/p>/;

const newHeader = `{booking.bookingType === 'TOUR' ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Request Submitted!
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Request has been generated. Please wait till we confirm your package... waiting time may increase according to availability and confirm receipt will be sent only after admin approves.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Booking Confirmed!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your ride request has been saved and sent to our dispatch team.
              </p>
            </>
          )}`;

content = content.replace(headerRegex, newHeader);


fs.writeFileSync(filePath, content);
console.log('Update complete.');
