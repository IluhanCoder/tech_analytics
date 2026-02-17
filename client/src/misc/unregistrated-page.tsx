import { Link } from "react-router-dom";
import { linkStyle, smallLinkStyle } from "../styles/link-styles";

const UnregistratedPage = () => {
  return (
    <div>
      Щоб корстуватися системою, вам необхідно{" "}
      <Link to="/signup" className={smallLinkStyle}>
        Зареєструватися
      </Link>
      , або{" "}
      <Link to="/login" className={smallLinkStyle}>
        Увійти в обліковий запис
      </Link>
    </div>
  );
};

export default UnregistratedPage;
