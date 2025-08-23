import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

const UserCardSkeleton = () => {
  return (
    <Card sx={{ width: 320, borderRadius: 4, boxShadow: 1, overflow: "hidden", m: 1 }}>
      <Box sx={{ backgroundColor: "#f5f5f5", py: 2, px: 1.5, textAlign: "center" }}>
        <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto' }} />
      </Box>
      <CardContent sx={{ backgroundColor: "#fafafa" }}>
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={2}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCardSkeleton;