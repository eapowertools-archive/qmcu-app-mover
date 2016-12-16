# qmcu-app-mover
This QMC Utilities plugin will allow users to export apps out of an environment and move them to other Qlik Sense environments.

###How it Works
App mover uses the QRS API to connect to the source and destination Qlik Sense servers. From the user interface, the user selects the apps they wish to deploy on a destination server from the source server. App mover takes that information, exports the app, then uploads and imports the app onto the destination site.


###Usage

![1](https://s3.amazonaws.com/eapowertools/qmcutilities/AppMover.png)

To use the app-mover plugin with QMC Utilities, you simply enter the hostname of the machine you want to pull the apps from, then add 1 or many machine names that you want to push the apps to. Once you enter the hostname to read the apps from, push the 'Load Apps' button and all the apps should appear in the list. You can then select which ones you would like to move.

_NOTE:_ *You must follow the certificate management section for app-mover to function.*

####   Certificate Management

App mover authenticates with the various Qlik Sense servers using certificates. In order to manage the certificates, you _MUST_ create a `certs` folder within the `appMover` plugin folder, which is usually found at `C:\Program Files\Qlik\Sense\EAPowerTools\QMCUtilities\plugins\appMover`. Which means you should end up with a folder structure that looks like `C:\Program Files\Qlik\Sense\EAPowerTools\QMCUtilities\plugins\appMover\certs`.  

Once this is done, you must create a folder for *EACH* machine you want to push or pull apps from. The name of the folder must match the hostname you use in the utility. This means you can use `localhost` or full-qualified domain names, as long as the network can resolve the name. Once you've created a subfolder with the name you will use in the utility, you must copy the respective certificates into the folder. You can find the certificates you need on the server you are trying to connect to at `C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\.Local Certificates`. You need the `client.pem`, and `client_key.pem` files. You then must put these files into the subfolder you created in the certs folder.

####   Example - Certificate Management

Lets say you want to pull apps from a machine called `central.myDomain.com` and push apps to a machine called `extendedServer.myDomain.com`. The folder structure would look as follows for the following certificates on the machine running QMC utilities if you have the default install location:  
`C:\Program Files\Qlik\Sense\EAPowerTools\QMCUtilities\plugins\appMover\certs\central.myDomain.com\client.pem`  
`C:\Program Files\Qlik\Sense\EAPowerTools\QMCUtilities\plugins\appMover\certs\central.myDomain.com\client_key.pem`  
`C:\Program Files\Qlik\Sense\EAPowerTools\QMCUtilities\plugins\appMover\certs\extendedServer.myDomain.com\client.pem`  
`C:\Program Files\Qlik\Sense\EAPowerTools\QMCUtilities\plugins\appMover\certs\extendedServer.myDomain.com\client_key.pem`
