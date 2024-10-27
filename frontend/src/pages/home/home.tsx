import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./home.css"
import { faComments, faFile } from "@fortawesome/free-regular-svg-icons"
import { faChartLine, faEllipsisVertical, faGear, faMagnifyingGlass, faMicrophone, faPaperclip, faPhone, faPhoneVolume } from "@fortawesome/free-solid-svg-icons"
import { Friends_list_component } from "../../components/friend_list_component/Friend_list_component"
import { array } from "yup"
import { Conversation_message_component } from "../../components/conversation_message_component/Conversation_message_component"
export const Home = () => {
  return (
<div className="home_main_container text-center d-flex flex-column" >
  <div className="row m-0">
    <div className="col-1">
      {/*
                --------| left panel |--------
      */}
      <div className="home_left_container justify-content-between d-flex flex-column">
        <div>
          {/* app's logo */}
          <label className="fs-5 mt-3 p-1 home_label home_logo">ChatApp</label>
        </div>
        {/* panel with all the buttons on the left side */}
        <div className="home_buttons_left d-flex gap-5 align-items-center flex-column">
          <div className="d-flex flex-column home_label_FS">
            {/* chat button */}
            <button className="home_button">
              <FontAwesomeIcon icon={faComments} className="fs-white home_icon"/>
              <p className="home_label">Rozmowy</p>
            </button>
          </div>
          <div className="d-flex flex-column home_label_FS">
            {/* work button */}
            <button className="home_button">
              <FontAwesomeIcon icon={faFile} className="fs-white home_icon"/>
              <p className="home_label">Praca</p>
            </button>
          </div>
          <div className="d-flex flex-column home_label_FS">
            {/* meetings button */}
            <button className="home_button">
              <FontAwesomeIcon icon={faPhone} className="fs-white home_icon"/>
              <p className="home_label">Spotkania</p>
            </button>
          </div>
          <div className="d-flex flex-column home_label_FS">
            {/* documents button */}
              <button className="home_button">
              <FontAwesomeIcon icon={faChartLine} className="fs-white home_icon"/>
            <p className="home_label">Dokumenty</p>
            </button>
          </div>
        </div>
        <div className="home_settings home_center d-flex flex-column home_label_FS">
          {/* settings button */}
          <button className="home_button">
            <FontAwesomeIcon icon={faGear} className="fs-white home_icon"/>
            <p className="home_label">Ustawienia</p>
          </button>
        </div>
      </div>
    </div>
    {/*
              --------| Middle panel |--------
    */}
    <div className="col-9 p-0">
      <div className="d-flex home_middle_container p-3">
        {/* Left side of the main panel, searchbar and friends */}
        <div className="col-4 home_middle_left_container d-flex flex-column">
          <div className="home_searchbar_container">
            <div className="home_searchbar">
              {/* Searchbar */}
              <button className="home_button">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="home_icon"/>
              </button>
              <input type="text" placeholder="Search" />
            </div>
            {/* Friends list */}
          </div>
          <div className="home_friend_list gap-2 d-flex flex-column">
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          <Friends_list_component/>
          </div>
        </div>
        {/* Right side of the main panel, main chat */}
        <div className="col-8 home_middle_right_container">

          {/* Header container*/}
          <div className="home_info_header d-flex justify-content-between mx-5">
            {/* Info container */}
            <div className="align-items-start d-flex flex-column">
              <label className="home_label home_chat_name m-0 p-0">Work</label>
              <h6 className="home_label m-0 p-0">5 members,24 online??</h6>
            </div>
            {/* Button container */}
            <div className="d-flex align-items-center justify-content-end gap-5">
              <div className="d-flex gap-2 home_label home_label_FS">
                {/* chat button */}
                <button className="home_button">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="fs-white home_icon"/>
                </button>
              </div>
              <div className="d-flex gap-2 home_label home_label_FS">
                {/* work button */}
                <button className="home_button">
                  <FontAwesomeIcon icon={faPhoneVolume} className="fs-white home_icon"/>
                </button>
              </div>
              <div className="d-flex gap-2 home_label home_label_FS">
                {/* meetings button */}
                <button className="home_button">
                  <FontAwesomeIcon icon={faEllipsisVertical} className="fs-white home_icon"/>
                </button>
              </div>
            </div>
          </div>
          <div className="home_conversation ms-3">
            <Conversation_message_component/>
            <Conversation_message_component/>
            <Conversation_message_component/>
            <Conversation_message_component/>
            <Conversation_message_component/>
            <Conversation_message_component/>
            <Conversation_message_component/>
            <Conversation_message_component/>
          </div>
          <div className="home_conversation_input ms-3">
              <form className="home_input w-100" onSubmit={(e)=>e.preventDefault()}>
              <input type="file" id="home_message_files" className="d-none"></input>
                <label className="home_button" htmlFor="home_message_files">
                    <FontAwesomeIcon icon={faPaperclip} className="fs-4 home_icon"/>
                </label>
                <input type="text" className="" placeholder="Your message" name="" id="" />
                <button className="home_button">
                  <FontAwesomeIcon icon={faMicrophone} className="fs-4 home_icon"/>
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
    <div className="col-2">
      {/*
                --------| right panel |--------
      */}
      {/* right panel that will include all the bs I don't know about */}
    </div>
  </div>
</div>
  )
}
