import { Card, CardContent, CardActions, Box, Skeleton } from "@mui/material";

const ResourceSkeleton = ({ type }) => {
  if (type === 'video') {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, bgcolor: 'grey.300' }}>
          <Skeleton variant="text" width="60%" height={30} />
        </Box>
        <Skeleton variant="rectangular" sx={{ paddingBottom: '56.25%' }} />
      </Card>
    );
  }
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, bgcolor: 'grey.300' }}>
        <Skeleton variant="text" width="60%" height={30} />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <Skeleton variant="circular" width={64} height={64} />
        <Skeleton variant="text" width="80%" sx={{ mt: 2, mb: 3 }} />
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
        <Skeleton variant="rounded" width={150} height={40} sx={{ mr: 2 }} />
        <Skeleton variant="rounded" width={150} height={40} />
      </CardActions>
    </Card>
  );
};

export default ResourceSkeleton;