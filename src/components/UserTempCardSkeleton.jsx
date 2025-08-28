import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

const UserTempCardSkeleton = () => {
  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Skeleton variant="text" width="70%" height={25} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="50%" height={20} sx={{ mx: 'auto', mt: 1 }} />
      </Box>
      <CardContent sx={{ backgroundColor: "#fafafa" }}>
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Skeleton variant="rounded" width={100} height={36} />
          <Skeleton variant="rounded" width={100} height={36} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserTempCardSkeleton;