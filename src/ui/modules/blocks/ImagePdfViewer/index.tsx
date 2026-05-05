import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import {
  forwardRef,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { TransitionProps } from '@mui/material/transitions';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { Loader, RowStack } from '../../components';
import { pxToRem } from '../../../../common';

export const CLOUD_FRONT_BASE_URL = process.env['NEXT_PUBLIC_CLOUD_FRONT_URL'];

export interface ImagePdfViewerProps {
  imageFileName: string;
  fileUri: string;
  children?: ReactNode;
}

const Transition = forwardRef<
  unknown,
  TransitionProps & { children: ReactElement }
>(function Transition({ children, ...rest }, ref) {
  return (
    <Slide direction="up" ref={ref} {...rest}>
      {children}
    </Slide>
  );
});

const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');
const isUri = (url: string) => url.toLowerCase().startsWith('https://');

export const ImagePdfViewer = ({
  imageFileName,
  fileUri,
  children,
}: ImagePdfViewerProps) => {
  const [openViewerModal, setOpenViewerModal] = useState(false);

  const defaultLayoutPluginInstanceRef = useRef(defaultLayoutPlugin());
  const defaultLayoutPluginInstance = defaultLayoutPluginInstanceRef.current;

  const handleOpen = () => setOpenViewerModal(true);

  const handleClose = () => setOpenViewerModal(false);

  const uri = useMemo(() => {
    return isUri(fileUri) ? fileUri : `${CLOUD_FRONT_BASE_URL}/${fileUri}`;
  }, [fileUri]);

  const isPdfFile = useMemo(() => isPdf(uri), [uri]);

  return (
    <>
      {children ? (
        <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
          {children}
        </Box>
      ) : (
        <RowStack
          spacing={1}
          onClick={handleOpen}
          sx={{
            cursor: 'pointer',
            alignItems: 'center',
          }}
        >
          <AttachFileIcon sx={{ color: 'text.primary' }} />

          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 500,
              fontSize: pxToRem(16),
              lineHeight: '24px',
              fontFamily: (theme) => theme.typography.fontFamily,
              textDecoration: 'underline',
            }}
          >
            {imageFileName}
          </Typography>
        </RowStack>
      )}

      <Dialog
        open={openViewerModal}
        slots={{
          transition: Transition,
        }}
        maxWidth={false}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              background: '#FFF',
              padding: '40px',
              width: {
                xs: '85vw',
                sm: '80vw',
                md: '65vw',
                lg: '55vw',
                xl: '50vw',
              },
              maxHeight: '85vh',
              height: 'auto',
              position: 'relative',
              overflow: 'hidden',
            },
          },
        }}
        scroll={'paper'}
        onClose={handleClose}
        keepMounted
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isPdfFile ? (
          <Box sx={{ height: '65vh', width: '100%' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={uri}
                plugins={[defaultLayoutPluginInstance]}
                renderLoader={() => (
                  <Stack
                    sx={{
                      height: '100%',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Loader size={50} />
                  </Stack>
                )}
              />
            </Worker>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              maxHeight: '75vh',
            }}
          >
            <Avatar
              src={uri}
              alt={imageFileName}
              sx={{
                width: '35vw',
                height: '45vh',
                borderRadius: '10px',
              }}
            />
          </Box>
        )}
      </Dialog>
    </>
  );
};
