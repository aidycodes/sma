import SettingsItem from '~/components/navbar/settings/settingsItem'
const settings = require('./settings.json')

const SettingsMenu = () => {
    
  return (
    <div  className="absolute right-0 lg:left-0 fg w-56 border-primary shadow-xl rounded-md "> 
      <h2 className="text-2xl font-semibold  p-2 border-b-1 border-primary-bottom shadow-sm ">Settings</h2>
        <div className="pt-2 max-h-60 overflow-hidden overflow-y-auto  ">
     {settings?.map((item: any) => (
                <SettingsItem key={item.id} content={item.content}  link={item.relativeId} 
                icon={item.icon || false} expandable={item.expandable || false}
                />
            ))
    }
        </div>
    </div>
    
  )
}

export default SettingsMenu