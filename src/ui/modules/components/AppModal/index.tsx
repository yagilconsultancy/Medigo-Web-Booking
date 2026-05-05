import { Dialog, Slide, SxProps } from '@mui/material';
import React, { forwardRef, ReactElement, Ref } from 'react';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {props.children}
    </Slide>
  );
});

export interface AppModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactElement;
  label: string;
  // right?: boolean;
  // left?: boolean;
  padding?: string;
  sx?: SxProps;
}

export const AppModal: React.FC<AppModalProps> = ({
  open,
  setOpen,
  label,
  children,
  padding = '28px 32px',
  sx,
  // right,
  // left,
}) => {
  // Define custom styles based on the 'right' prop
  // const customStyles: SxProps = right
  //   ? {
  //       "& .MuiDialog-paper": {
  //         position: "absolute",
  //         right: -15,
  //         top: -15,
  //       },
  //     }
  //   : left
  //     ? {
  //         "& .MuiDialog-paper": {
  //           position: "absolute",
  //           left: -15,
  //           top: -15,
  //         },
  //       }
  //     : {
  //         "& .MuiDialog-paper": {},
  //       };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby={label}
      TransitionComponent={Transition}
      maxWidth={false}
      PaperProps={{
        style: {
          borderRadius: '16px',
          margin: '20px',
          overflowX: 'hidden',
          maxWidth: 'calc(100vw - 40px)',
          padding,
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          width: 'auto',
          minWidth: 'fit-content',
        },
        // ...customStyles,
        ...sx,
      }}
    >
      {children}
    </Dialog>
  );
};
