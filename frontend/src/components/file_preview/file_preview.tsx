import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MessageFilePreview } from "../../types/types"
import "./file_preview.css"
import { faCircleXmark, faFileLines } from "@fortawesome/free-solid-svg-icons";

interface props {
  file: MessageFilePreview;
  setFiles: React.Dispatch<React.SetStateAction<MessageFilePreview[]>>;
  files: MessageFilePreview[];
}

export const FilePreview: React.FC<props> = ({ file, setFiles, files }) => {

  if(file.preview) 
    return (
      <div className="position-relative">
        <img src={file.preview} height="50px" width="50px" className="rounded"/>
        <button type="button" className="position-absolute start-100 top-0 translate-middle translate-center" onClick={() => setFiles(files.filter(f => f.name != file.name))}>
          <FontAwesomeIcon className="text-white" icon={faCircleXmark} />
        </button>
      </div>
    )
  return (
    <div className="rounded d-flex align-items-center gap-3 position-relative file_container">
      <FontAwesomeIcon className="fs-3 text-white" icon={faFileLines} />
      <p className="text-white fs">{file.name}</p>
      <button type="button" className="position-absolute start-100 top-0 translate-middle translate-center" onClick={() => setFiles(files.filter(f => f.name != file.name))}>
        <FontAwesomeIcon className="text-white" icon={faCircleXmark} />
      </button>
    </div>
  )
}
