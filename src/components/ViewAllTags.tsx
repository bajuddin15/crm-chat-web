import { useEffect, useState } from "react";
import { deleteTag, getAllTagsByCid } from "../api";
import { ChevronLeft } from "lucide-react";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

interface IProps {
  token: string;
  conversationId: string;
  setShowTagsComp: any;
}
const ViewAllTags: React.FC<IProps> = ({
  token,
  conversationId,
  setShowTagsComp,
}) => {
  const [tags, setTags] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllTags = async (token: string, conversationId: string) => {
    setLoading(true);
    const data = await getAllTagsByCid(token, conversationId);
    if (data && data?.code === 200) {
      setTags(data?.data);
    }
    setLoading(false);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!tagId) return;
    const data = await deleteTag(token, tagId);
    if (data && data?.code === "200") {
      const resp = await getAllTagsByCid(token, conversationId);
      if (resp && resp?.code === 200) {
        setTags(resp?.data);
      }
      toast.success(data?.status);
    }
  };

  useEffect(() => {
    fetchAllTags(token, conversationId);
  }, []);
  return (
    <div className="space-y-5 p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => setShowTagsComp(false)}>
          <ChevronLeft size={18} color="gray" />
        </div>
        <span className="text-sm">Tags</span>
      </div>

      <div>
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="text-sm">Loading...</span>
          </div>
        ) : tags?.length === 0 ? (
          <div className="bg-blue-100 px-5 py-5 rounded-xl">
            <span className="text-sm">No tags available</span>
          </div>
        ) : (
          <div className="space-y-2">
            {tags?.map((item: any) => {
              return (
                <div
                  key={item?.id}
                  className="flex items-center justify-between bg-blue-200 rounded-xl"
                >
                  <div className="text-sm space-y-1 bg-blue-100 w-full p-3 rounded-tl-xl rounded-bl-xl">
                    <p>{item?.tag}</p>
                    <div className="flex items-center justify-between">
                      <div></div>
                      <span className="text-xs">{item?.created_at}</span>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer px-4"
                    onClick={() => handleDeleteTag(item?.id)}
                  >
                    <MdDelete size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllTags;
