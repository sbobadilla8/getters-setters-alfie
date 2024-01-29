import React from 'react';

import { ChevronRightIcon } from '@chakra-ui/icons';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

function BreadcrumbList({ breadcrumbs }) {
  return (
    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
      {breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem key={breadcrumb}>
          <BreadcrumbLink>{breadcrumb}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}

export default BreadcrumbList;
