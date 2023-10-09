import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faGithub} from '@fortawesome/free-brands-svg-icons'
import Table from './Table';
function App() {
  return (
    <div className='flex flex-col h-full min-h-screen'>
      <div className='border-b-2 border-black border-solid h-fit'>
        <div className='text-3xl p-4 font-bold'>
          FlexiBee Demo
        </div>
      </div>
      <div className='h-full p-4 flex-grow'>
        <Table/>
      </div>
      <div className='h-fit border-black border-solid border-t-2 p-2 flex-shrink-0'>
        <div className='text-xl font-bold'>
          <a href='https://github.com/ondrejkno2p/flexibee-demo'>
            <div className='flex w-fit'>
              <FontAwesomeIcon className='px-2' size='xl' icon={faGithub}/>
              <div>
                Zdrojový Kód
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
