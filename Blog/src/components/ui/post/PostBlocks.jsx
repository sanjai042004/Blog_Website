export  const PostBlocks=({ blocks })=> {
  return (
    <>
      {blocks?.map((block, index) => (
        <div key={block._id || index} className="mb-6">
          {block.youtubeEmbed && (
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
              }}
            >
              <iframe
                src={block.youtubeEmbed}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          )}

          {block.type === "image" && block.media && (
            <img
              src={
                block.media.startsWith("http")
                  ? block.media
                  : `${import.meta.env.VITE_API_URL}${block.media}`
              }
              alt={block.content || "Post media"}
              className="w-full h-80 object-contain rounded mb-6"
            />
          )}

          {block.type === "subtitle" && (
            <h2 className="text-2xl font-bold mb-4">{block.content}</h2>
          )}

          {block.content && (
            <p className="break-words text-xl text-gray-900 leading-8 whitespace-pre-line mb-10 max-w-[70ch] mx-auto">
              {block.content}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
