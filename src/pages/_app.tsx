import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider themes={['light','dark','neon','darkblue']}>
      <Component {...pageProps} />
  </ThemeProvider>
  )
};

export default api.withTRPC(MyApp);
