import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from '~/components/navbar'

const MyApp: AppType = ({ Component, pageProps }) => {
  
  return (
    <ThemeProvider enableSystem={false} themes={['light','dark','neon','darkblue', 'darkFix', 'lightFix', 'dark-blueFix', 'neonFix']}>
       <Navbar/>
      <Component {...pageProps} />
  </ThemeProvider>
  )
};

export default api.withTRPC(MyApp);
