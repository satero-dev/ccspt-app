import React, { useState } from 'react';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import { IconButton } from "@mui/material"

interface Props { }

const FullscreenMode: React.FC<Props> = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div>
      <IconButton onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </div>
  );
};

export default FullscreenMode;
