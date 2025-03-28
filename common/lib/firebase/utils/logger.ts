export const logError = (context: string, error: any) => {
  const errorMessage = error?.message || String(error);
  const errorDetails = {
    timestamp: new Date().toISOString(),
    context,
    message: errorMessage,
    stack: error?.stack,
  };
  
  console.error('Firebase Error:', errorDetails);
  return errorDetails;
};

export const logInfo = (context: string, message: string, data?: any) => {
  const logDetails = {
    timestamp: new Date().toISOString(),
    context,
    message,
    data,
  };
  
  console.log('Firebase Info:', logDetails);
  return logDetails;
};