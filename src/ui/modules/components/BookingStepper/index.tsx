'use client';

import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

export type BookingStepperStep = {
  label: string;
};

export type BookingStepperProps = {
  activeStep: number;
  steps: BookingStepperStep[];
};

export function BookingStepper({ activeStep, steps }: BookingStepperProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: pxToRem(2),
            borderColor: '#E2E8F0',
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: '#007AFF',
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: '#007AFF',
          },
          '& .MuiStepLabel-iconContainer': {
            // py: 5,
            p: 0,
          },
        }}
      >
        {steps.map((s, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <Step key={s.label} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: pxToRem(32),
                      height: pxToRem(32),
                      borderRadius: '999999px',
                      bgcolor: isActive || isCompleted ? '#007AFF' : '#FFFFFF',
                      border:
                        isActive || isCompleted
                          ? '0px solid transparent'
                          : '2px solid #E2E8F0',
                      boxShadow: isActive
                        ? '0px 1px 3px rgba(0,122,255,0.3), 0px 1px 2px rgba(0,122,255,0.3)'
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(11),
                        lineHeight: pxToRem(16.5),
                        fontWeight: 700,
                        color: isActive || isCompleted ? '#FFFFFF' : '#CBD5E1',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                )}
              >
                <Typography
                  sx={{
                    mt: pxToRem(8),
                    fontSize: pxToRem(10),
                    lineHeight: pxToRem(13),
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#007AFF' : '#94A3B8',
                    textAlign: 'center',
                  }}
                >
                  {s.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
