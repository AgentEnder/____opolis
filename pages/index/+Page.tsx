export default Page;

function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Welcome to Opolis</h1>
      <p className="text-lg text-gray-600 mb-4">
        Experience the strategic city-building games from Button Shy Games in your browser.
      </p>
      <p className="text-gray-600">
        Build sprawling cities, cultivate agricultural lands, or manage bustling casinos. 
        Each game offers unique challenges and endless replayability in a compact format.
      </p>
      <div className="mt-8">
        <a href="/play" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
          Start Playing
        </a>
      </div>
    </>
  );
}