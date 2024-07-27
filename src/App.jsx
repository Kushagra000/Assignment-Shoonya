
import './app.css'
import Card from './components/Card'
function App() {


  return (
    <>
      <header>
        <h1>Wellness Retreats</h1>
      </header>
      <div className='Hero'>
        <img src='https://cdn.midjourney.com/32923aeb-db8c-4c27-8e9d-fb82928b7fc1/0_2.jpeg'/>
        <h1>Discover your inner peace</h1>
        <p>Join us for a series of wellness retreats designed to help you find tranquility and rejuvenation.</p>
      </div>
      <Card/>
    </>
  )
}

export default App
