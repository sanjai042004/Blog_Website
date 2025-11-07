export const TopicsSidebar = () => {
  const topics = [
    "Technology",
    "Programming",
    "AI & Ml",
    "Relationships",
    "Politics",
    "Freelancing",
  ];

  return (
    <aside className="fixed top-20 right-16 border-l border-gray-200 min-h-screen w-2xs p-6">
      <h2 className="text-2xl font-extrabold mb-8">Categories</h2>
      <ul className="grid grid-cols-2 gap-5">
        {topics.map((topic) => (
          <li key={topic}>
            <button className="block text-left p-2 cursor-pointer bg-gray-100 rounded-3xl text-gray-500">
              {topic}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">Who to Follow</h3>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </aside>
  );
};
