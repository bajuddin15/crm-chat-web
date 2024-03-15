import { useEffect, useState } from "react";
import { deleteNote, getAllNotesByCid } from "../api";
import { ChevronLeft } from "lucide-react";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

interface IProps {
  token: string;
  conversationId: string;
  setShowNotesComp: any;
}
const ViewAllNotes: React.FC<IProps> = ({
  token,
  conversationId,
  setShowNotesComp,
}) => {
  const [notes, setNotes] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchAllNotes = async (token: string, conversationId: string) => {
    setLoading(true);
    const data = await getAllNotesByCid(token, conversationId);
    if (data && data?.code === 200) {
      setNotes(data?.data);
    }
    setLoading(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!noteId) return;
    const data = await deleteNote(token, noteId);
    if (data && data?.code === "200") {
      const resp = await getAllNotesByCid(token, conversationId);
      if (resp && resp?.code === 200) {
        setNotes(resp?.data);
      }
      toast.success(data?.status);
    }
  };

  useEffect(() => {
    fetchAllNotes(token, conversationId);
  }, []);
  return (
    <div className="space-y-5 p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => setShowNotesComp(false)}>
          <ChevronLeft size={18} color="gray" />
        </div>
        <span className="text-sm">Notes</span>
      </div>

      <div>
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="text-sm">Loading...</span>
          </div>
        ) : notes?.length === 0 ? (
          <div className="bg-blue-100 px-5 py-5 rounded-xl">
            <span className="text-sm">No notes available</span>
          </div>
        ) : (
          <div className="space-y-2">
            {notes?.map((item: any) => {
              return (
                <div
                  key={item?.id}
                  className="flex items-center justify-between bg-blue-200 rounded-xl"
                >
                  <div className="text-sm space-y-1 bg-blue-100 w-full p-3 rounded-tl-xl rounded-bl-xl">
                    <p>{item?.note}</p>
                    <div className="flex items-center justify-between">
                      <div></div>
                      <span className="text-xs">{item?.created_at}</span>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer px-4"
                    onClick={() => handleDeleteNote(item?.id)}
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

export default ViewAllNotes;
