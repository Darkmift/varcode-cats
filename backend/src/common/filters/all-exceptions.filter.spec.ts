import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import AllExceptionsFilter from './http-exception-filter';
import { DatadogLogger } from '@/utils/datadog/datadog';

// Create a type for the mocked functions of DatadogLogger
type MockedDatadogLogger = Partial<Record<keyof DatadogLogger, jest.Mock>>;

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockLogger: MockedDatadogLogger;

  beforeEach(async () => {
    // Initialize the mock logger with only necessary methods mocked
    mockLogger = {
      error: jest.fn(),
    };

    // Create a testing module that mimics the app's module structure
    const module: TestingModule = await Test.createTestingModule({
      // Provide the mock logger directly
      providers: [
        AllExceptionsFilter,
        {
          provide: DatadogLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    // Retrieve instances from the module
    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  it('should log and format errors correctly', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    // Mocking ArgumentsHost
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: mockStatus,
        }),
        getRequest: () => ({
          url: '/test-url',
        }),
      }),
    };

    // Simulate an exception being caught by the filter
    const exception = new HttpException(
      'Test exception',
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, host as any);

    // Assertions
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Test exception',
      expect.anything(), // Since we can't predict the exact trace, using expect.anything()
      '/test-url',
    );
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Test exception',
    });
  });

  // Add more tests as needed for different exception types and behaviors
});
