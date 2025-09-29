import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import { Delete, CloudUpload, PlayArrow } from '@mui/icons-material';

const VideoManagement = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock video data
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Training Session - Dribbling',
      playerName: 'John Doe',
      duration: '2:45',
      uploadDate: '2024-01-15',
      size: '45 MB',
      thumbnail: '/api/placeholder/300/200',
      status: 'processed'
    },
    {
      id: 2,
      title: 'Match Highlights - vs City FC',
      playerName: 'Mike Smith',
      duration: '5:20',
      uploadDate: '2024-01-14',
      size: '120 MB',
      thumbnail: '/api/placeholder/300/200',
      status: 'processing'
    },
    {
      id: 3,
      title: 'Goal Scoring Practice',
      playerName: 'Carlos Ruiz',
      duration: '3:15',
      uploadDate: '2024-01-13',
      size: '65 MB',
      thumbnail: '/api/placeholder/300/200',
      status: 'processed'
    }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('File size must be less than 500MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add the uploaded video to the list
          const newVideo = {
            id: videos.length + 1,
            title: selectedFile.name,
            playerName: 'John Doe', // This would come from form data
            duration: '0:00',
            uploadDate: new Date().toISOString().split('T')[0],
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            thumbnail: '/api/placeholder/300/200',
            status: 'processing'
          };
          
          setVideos(prev => [...prev, newVideo]);
          setUploadDialogOpen(false);
          setSelectedFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDeleteVideo = (videoId: number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(video => video.id !== videoId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Video Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Video
        </Button>
      </Box>

      {/* Stats Cards - Using Box layout instead of Grid */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Videos
            </Typography>
            <Typography variant="h4">
              {videos.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Processed
            </Typography>
            <Typography variant="h4">
              {videos.filter(v => v.status === 'processed').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Processing
            </Typography>
            <Typography variant="h4">
              {videos.filter(v => v.status === 'processing').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Storage
            </Typography>
            <Typography variant="h4">
              230 MB
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Videos Grid - Using CSS Grid instead of MUI Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
        gap: 3 
      }}>
        {videos.map((video) => (
          <Card key={video.id}>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                position: 'relative',
                backgroundColor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1
                }}
              >
                <Chip 
                  label={video.status} 
                  color={getStatusColor(video.status) as any}
                  size="small"
                />
              </Box>
              <IconButton 
                sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                size="large"
              >
                <PlayArrow />
              </IconButton>
            </CardMedia>
            <CardContent>
              <Typography variant="h6" gutterBottom noWrap>
                {video.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Player: {video.playerName}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                  {video.duration} • {video.size}
                </Typography>
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => handleDeleteVideo(video.id)}
                >
                  <Delete />
                </IconButton>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Uploaded: {video.uploadDate}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => !isUploading && setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Video
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              disabled={isUploading}
            >
              Select Video File
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleFileSelect}
              />
            </Button>
            
            {selectedFile && (
              <Typography variant="body2">
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
              </Typography>
            )}

            {isUploading && (
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" gutterBottom>
                  Uploading... {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUploadDialogOpen(false)} 
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoManagement;
