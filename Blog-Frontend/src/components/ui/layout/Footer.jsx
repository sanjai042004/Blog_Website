export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm text-center py-2  border-t border-gray-200 text-sm text-gray-600">
      <p>&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
    </footer>
  );
};
