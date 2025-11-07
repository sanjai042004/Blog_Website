import { useNavigate } from "react-router-dom";

export const ExploreTopics = () => {
  const navigate = useNavigate();

  const topics = ["React", "JavaScript", "CSS", "HTML", "NodeJS"]; 

  const handleTopicClick = (topic) => {
    setSearchTerm(topic);
    navigate(`/?search=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="flex justify-center w-full overflow-x-auto py-3">
      <div className="flex gap-3 px-4 whitespace-nowrap">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => handleTopicClick(topic)}
            className="px-4 py-2 cursor-pointer border-none rounded-full text-sm font-medium hover:bg-gray-500 hover:text-white transition"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};
