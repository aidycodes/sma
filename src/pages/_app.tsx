import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "jotai";

const MyApp: AppType = ({ Component, pageProps }) => {
  
  return (
    <Provider>
    <ThemeProvider enableSystem={false} themes={['light','dark','neon','darkblue', 'darkFix', 'lightFix', 'dark-blueFix', 'neonFix']}>     
      <Component {...pageProps} />
  </ThemeProvider>
  </Provider>
  )
};

export default api.withTRPC(MyApp);
