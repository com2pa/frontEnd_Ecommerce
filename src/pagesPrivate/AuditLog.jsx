import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  HStack,
  VStack,
  Text,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
  Tooltip,
  Spinner,
  Flex,
  useToast,
  FormControl,
  FormLabel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, TimeIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLog, setSelectedLog] = useState(null);
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const tableVariant = useBreakpointValue({ base: 'simple', md: 'striped' });

  const actionColors = {
    login: 'green',
    logout: 'orange',
    login_failed: 'red',
    access_denied: 'red',
    create: 'blue',
    read: 'teal',
    update: 'yellow',
    delete: 'red',
    edit: 'purple',
    system_start: 'green',
    system_stop: 'red',
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await axios.get('/api/activity-logs', { params });
      setLogs(response.data.data.docs);
      setPagination({
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
        totalPages: response.data.data.totalPages,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch activity logs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      userId: '',
      startDate: '',
      endDate: '',
      search: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log);
    onOpen();
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'PPpp');
  };

  const renderMetadata = (metadata) => {
    if (!metadata) return null;
    
    return (
      <VStack align="start" spacing={2}>
        {Object.entries(metadata).map(([key, value]) => (
          <Box key={key}>
            <Text fontWeight="bold">{key}:</Text>
            <Text fontSize="sm" fontFamily="mono" whiteSpace="pre-wrap" wordBreak="break-word">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </Text>
          </Box>
        ))}
      </VStack>
    );
  };

  return (
    <SidebarHeader>
      <Box p={{ base: 4, md: 6 }}>
        <Heading as="h1" size="xl" mb={6}>
          Activity Logs
        </Heading>

        {/* Filters */}
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm" mb={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="md">
              Filters
            </Heading>
            <Button
              size="sm"
              variant="ghost"
              rightIcon={showAdvancedFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Hide' : 'More'} Filters
            </Button>
          </Flex>

          <Stack spacing={4}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Search</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search logs..."
                  />
                </InputGroup>
              </FormControl>
            </Stack>

            {showAdvancedFilters && (
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <FormControl>
                  <FormLabel>Action</FormLabel>
                  <Select
                    name="action"
                    value={filters.action}
                    onChange={handleFilterChange}
                    placeholder="All actions"
                  >
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="login_failed">Login Failed</option>
                    <option value="access_denied">Access Denied</option>
                    <option value="create">Create</option>
                    <option value="read">Read</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="edit">Edit</option>
                    <option value="system_start">System Start</option>
                    <option value="system_stop">System Stop</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Entity Type</FormLabel>
                  <Input
                    name="entityType"
                    value={filters.entityType}
                    onChange={handleFilterChange}
                    placeholder="Entity type"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>User ID</FormLabel>
                  <Input
                    name="userId"
                    value={filters.userId}
                    onChange={handleFilterChange}
                    placeholder="User ID"
                  />
                </FormControl>
              </Stack>
            )}

            <HStack spacing={4} mt={2}>
              <Button colorScheme="blue" onClick={handleSearch}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </HStack>
          </Stack>
        </Box>

        {/* Logs Table */}
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm" overflowX="auto">
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <>
              <Table variant={tableVariant} size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    {!isMobile && <Th>Date</Th>}
                    <Th>User</Th>
                    <Th>Action</Th>
                    {!isMobile && <Th>Entity</Th>}
                    {!isMobile && <Th>IP Address</Th>}
                    <Th>Details</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logs.map((log) => (
                    <Tr key={log._id} _hover={{ bg: 'gray.50' }}>
                      {!isMobile && (
                        <Td>
                          <Tooltip label={formatDate(log.createdAt)}>
                            <Text>{format(parseISO(log.createdAt), 'PP')}</Text>
                          </Tooltip>
                        </Td>
                      )}
                      <Td>
                        {log.user ? (
                          <Text fontWeight="medium" isTruncated maxW="150px">
                            {isMobile ? log.user.name : `${log.user.name} (${log.user.email})`}
                          </Text>
                        ) : (
                          <Text color="gray.500">System</Text>
                        )}
                      </Td>
                      <Td>
                        <Badge colorScheme={actionColors[log.action] || 'gray'}>
                          {log.action}
                        </Badge>
                      </Td>
                      {!isMobile && (
                        <Td>
                          {log.entityType && (
                            <Text isTruncated maxW="150px">
                              {log.entityType} {log.entityId && `(${log.entityId})`}
                            </Text>
                          )}
                        </Td>
                      )}
                      {!isMobile && <Td>{log.ipAddress}</Td>}
                      <Td>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewLogDetails(log)}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* Pagination */}
              <Flex justify="space-between" mt={4} align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
                <Text fontSize="sm">
                  Showing {logs.length} of {pagination.total} logs
                </Text>
                <HStack spacing={2}>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    aria-label="Previous page"
                    isDisabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                  />
                  <Text fontSize="sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </Text>
                  <IconButton
                    icon={<ChevronRightIcon />}
                    aria-label="Next page"
                    isDisabled={pagination.page === pagination.totalPages}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                  />
                </HStack>
              </Flex>
            </>
          )}
        </Box>

        {/* Log Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Activity Log Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedLog && (
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontWeight="bold">Date:</Text>
                    <Text>{formatDate(selectedLog.createdAt)}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">User:</Text>
                    <Text>
                      {selectedLog.user
                        ? `${selectedLog.user.name} (${selectedLog.user.email})`
                        : 'System'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Action:</Text>
                    <Badge colorScheme={actionColors[selectedLog.action] || 'gray'}>
                      {selectedLog.action}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Entity:</Text>
                    <Text>
                      {selectedLog.entityType || 'N/A'} {selectedLog.entityId && `(${selectedLog.entityId})`}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">IP Address:</Text>
                    <Text>{selectedLog.ipAddress}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">User Agent:</Text>
                    <Text whiteSpace="pre-wrap" wordBreak="break-word">{selectedLog.userAgent || 'N/A'}</Text>
                  </Box>
                  <Box width="full">
                    <Text fontWeight="bold">Metadata:</Text>
                    <Box width="full" overflowX="auto">
                      {renderMetadata(selectedLog.metadata)}
                    </Box>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </SidebarHeader>
  );
};

export default AuditLog;