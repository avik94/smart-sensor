# Unit Test of Expert_Viz

This application using "Vue Test Utils" with "Jest" for testing.

## All Test Case


```bash
√ [Quick Time Select] Click Quick Time Working Properly.
√ [Time Zone Select] Click Time Format Working Properly.
√ [Submit Custom Time] Submit custom time Button Working Properly
√ [Stat Select] Click Stat(Voltage(L-N),Voltage(L-L),Current-3 phase) Line, Min, Max, Data Table tab will open  
√ [Stat Select] Click Stat(PF-3 phase, Neutral current) Line, Data Table tab will open.for the rest stats remaining tab will open
√ [Wrong Input Selection] When Proper Datas are not present, Data Will not Render 
√ [Time Zone Value]Time Zone List Should Be [IST, UTC, EST] 
√ [Stat Name] Stat List Should Be [Voltage(L-N),Voltage(L-L), Current-3 phase, PF-3 phase, Neutral current,Step Current Change (A), Voltage variation (%), Voltage Total Harmonic Distortion (%), Current Total Harmonic Distortion (%), Frequency Variation (%)]
√ [Threshold Select] Threshold Updates Working Properly 
√ [Clear Custom Time] Clear Input Working Properly
√ [Line Plot Generate] Process Data For Line Plot Work Properly
√ [Max Line Plot Generate] Process Data For Max Line Plot Work Properly
√ [Min Line Plot Generate] Process Data For Min Line Plot Work Properly
√ [Event Trap Generate Line and Bar Plot] Event Trap Process Data Working Properly And Bar Plot Rendered
√ [Event Trap Sine Plot Generate] Event Trap Sine Plot Working Properly
√ [Event Trap Fft Plot Generate] Event Trap fft Plot Working Properly


```

## To run Test

```
npm run test:unit
```