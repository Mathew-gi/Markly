import clsx from "clsx";
import "../styles/globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600", "700"], display: "swap"})

export default function App({ Component, pageProps }) {
  return (
    <div className={clsx(montserrat.className, "text-slate-900 overflow-hidden")}>
      <Component {...pageProps} />
    </div>
  );
}
