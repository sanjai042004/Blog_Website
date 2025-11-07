export const Loading = () => <div className="text-center py-20">Loading...</div>;

export const ErrorMessage = ({ message }) => (
  <div className="text-center py-20 text-red-500">{message}</div>
);
