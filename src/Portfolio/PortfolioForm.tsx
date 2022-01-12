import { useEffect, useState } from "react";
import classes from "./PortfolioForm.module.scss";
import { motion } from "framer-motion";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
function PortfolioForm() {
  const [inputValue, setInputValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [result, setResult] = useState(false);

  return (
    <div>
      <input type="text"></input>
    </div>
  );
}

export default PortfolioForm;
