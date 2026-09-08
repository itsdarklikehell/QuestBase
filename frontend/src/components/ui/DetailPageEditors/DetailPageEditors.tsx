import DOMPurify from "dompurify";
import detailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import styles from "./DetailPageEditors.module.css"
import { Edit, Globe, Lock } from "lucide-react"
import TextEditor from "../TextEditor/TextEditor"

type EditorState = {
  notes: string
  setNotes: React.Dispatch<React.SetStateAction<string>>
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

type DetailPageEditorsProps = {
  owner: boolean
  general: EditorState
  personal: EditorState
}

export default function DetailPageEditors({
  owner,
  general,
  personal
}: DetailPageEditorsProps) {
  return(
    <>
      {(general.notes || owner) && <div>
        <div className={detailPageStyles.section_header}>
          <p>General Notes:</p>
          <div className={`${layoutStyles.card_flex} ${styles.public}`}>
                <Globe/>
                Public
              </div>
          {owner && 
            <>
              <Edit
                className={`${detailPageStyles.blue_icon} ${general.show ? detailPageStyles.active : ""}`}
                onClick={() => general.setShow(!general.show)}/>
            </>
          }
        </div>
        {general.show && owner ? (
          <TextEditor
            value={general.notes}
            onChange={general.setNotes}
          />
        ) : (
          general.notes 
            ? <div 
                className={layoutStyles.editor_notes}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(general.notes)
                }}
              />
            : <p style={{ color: "grey" }}>No general notes yet...</p>
        )}
      </div>}

      <div>
        <div className={detailPageStyles.section_header}>
          <p>Personal Notes:</p>
          <div className={`${layoutStyles.card_flex} ${styles.private}`}>
            <Lock/>
            Private
          </div>
          <Edit
            className={`${detailPageStyles.blue_icon} ${personal.show ? detailPageStyles.active : ""}`}
            onClick={() => personal.setShow(!personal.show)}/>
        </div>
        {personal.show ? (
          <TextEditor
            value={personal.notes}
            onChange={personal.setNotes}
          />
        ) : (
          personal.notes 
            ? <div 
                className={layoutStyles.editor_notes}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(personal.notes)
                }}
              />
            : <p style={{ color: "grey" }}>No personal notes yet...</p>
        )}
      </div>
    </>
  )
}