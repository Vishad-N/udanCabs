const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/client/components/modals/BookingModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add passengerNames to schema
content = content.replace(
  /passengers: z\.number\(\)\.min\(1\)\.max\(20\)\.optional\(\),/,
  `passengers: z.number().min(1).max(20).optional(),\n  passengerNames: z.array(z.string()).optional(),`
);

// 2. Add passengerNames to defaultValues
content = content.replace(
  /passengers: 4,/,
  `passengers: 4,\n      passengerNames: [],`
);

// 3. Step 3 UI
const step3Regex = /\{\/\* STEP 3: PASSENGER DETAILS \*\/\}[\s\S]*?(?=\{\/\* STEP 4: BOOKING REVIEW & CONFIRMATION \*\/)/;

const newStep3 = `{/* STEP 3: PASSENGER DETAILS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {activeTab === 'Tours' ? (
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border/40 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                    <Calendar size={18} />
                    <span>Select Tour Date & Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Date of Tour</label>
                      <input
                        type="date"
                        {...register('pickupDate')}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Reporting Time</label>
                      <input
                        type="time"
                        {...register('pickupTime')}
                        className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border/40">
                  <ScheduleSelector
                    isScheduled={isScheduled}
                    onScheduleChange={setIsScheduled}
                    selectedDate={scheduledDate}
                    onDateChange={setScheduledDate}
                    selectedTimeStr={scheduledTimeStr}
                    onTimeChange={setScheduledTimeStr}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTab !== 'Tours' && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name *</label>
                    <input
                      {...register('customerName')}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    {errors.customerName && <p className="mt-1 text-xs text-destructive">{errors.customerName.message}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Mobile Number *</label>
                  <input
                    {...register('customerPhone')}
                    maxLength={10}
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  {errors.customerPhone && <p className="mt-1 text-xs text-destructive">{errors.customerPhone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address (Optional)</label>
                  <input
                    {...register('customerEmail')}
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  {errors.customerEmail && <p className="mt-1 text-xs text-destructive">{errors.customerEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Passengers *</label>
                  <select
                    {...register('passengers', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    {Array.from(
                      { length: activeTab === 'Tours' ? (selectedTourCar?.maxPassengers || 4) : 17 }, 
                      (_, i) => activeTab === 'Tours' ? i + 1 : [1, 2, 3, 4, 5, 6, 7, 8, 12, 17][i]
                    ).filter(Boolean).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                {activeTab === 'Airport' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Flight Number (Optional)</label>
                    <input
                      {...register('flightNumber')}
                      placeholder="e.g. IndiGo 6E-5432"
                      className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                )}
              </div>

              {activeTab === 'Tours' && watchPassengers > 0 && (
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users size={16} className="text-primary" /> Passenger Names
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: watchPassengers }).map((_, idx) => (
                      <div key={idx}>
                        <input
                          {...register(\`passengerNames.\${idx}\` as any, { required: "Name is required" })}
                          placeholder={\`Passenger \${idx + 1} Name\`}
                          className="w-full rounded-xl border border-border bg-input/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                        {errors.passengerNames?.[idx] && (
                          <p className="mt-1 text-[10px] text-destructive">{(errors.passengerNames[idx] as any)?.message || "Required"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Special Notes / Instructions</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="e.g. Clean AC cab, elder passenger assistance required..."
                  className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>
          )}

          `;

content = content.replace(step3Regex, newStep3);


// 4. Update Final Review passenger display
const reviewGridRegex = /<span className="text-muted-foreground block">Tour Duration:<\/span>\s*<span className="font-semibold text-foreground">\{selectedTourPackage\?\.duration\}<\/span>\s*<\/div>\s*<\/>/

const newReviewGrid = `<span className="text-muted-foreground block">Tour Duration:</span>
                        <span className="font-semibold text-foreground">{selectedTourPackage?.duration}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground block">Passengers:</span>
                        <span className="font-semibold text-foreground">
                          {watch('passengerNames')?.filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </>`;
content = content.replace(reviewGridRegex, newReviewGrid);

// 5. Update Payload to include passengerNames and populate customerName for Tours to avoid validation errors
const payloadRegex = /const payload = \{\s*\.\.\.data,/;
const newPayload = `const payload = {
        ...data,
        customerName: activeTab === 'Tours' ? (data.passengerNames?.[0] || 'Tour Booker') : data.customerName,
        passengerNames: activeTab === 'Tours' ? data.passengerNames : [],`;
content = content.replace(payloadRegex, newPayload);


fs.writeFileSync(filePath, content);
console.log('Step 3 Update complete.');
