import "./Friend_list_component.css"
export const Friends_list_component=()=>{
    return (              
    <div className="home_friend d-flex align-items-center">
        <img src="https://bi.im-g.pl/im/62/6d/17/z24567394AMP,Kat---Roman-Kostrzewski--od-lewej--Krzysztof--Pist.jpg" className="w-25"/>
        <div className="home_friend_details w-50 d-flex align-items-start px-3 flex-column gap-2">
          <h5 className="home_label p-0 m-0">traktor</h5>
          <label className="home_label">cos</label>
        </div>
        <div className="home_friend_utilities w-25 d-flex flex-column align-items-end gap-2">
          <label className="home_label">4 min</label>
          <label className="bg-primary home_badge">99+</label>
        </div>
    </div>)
}