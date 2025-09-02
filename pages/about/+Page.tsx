export default Page;

function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">About Opolis Games</h1>
      <div className="space-y-4 text-gray-600">
        <p>
          The Opolis series brings the award-winning wallet games from Button Shy Games to your browser. 
          These strategic city-building games pack incredible depth into a minimal format.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">The Games</h2>
        
        <div className="grid gap-6 mt-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Sprawlopolis</h3>
            <p>
              Build a sprawling city by placing cards to create zones and roads. 
              Balance competing scoring conditions while managing the city's expansion.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Agropolis</h3>
            <p>
              Cultivate the countryside with orchards, wheat fields, and livestock. 
              Create feeding chains and harvest bonuses in this agricultural variant.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Casinopolis</h3>
            <p>
              Design the ultimate entertainment district with casinos, hotels, and attractions. 
              Maximize tourist appeal while managing the city's nightlife.
            </p>
          </div>
        </div>
        
        <p className="pt-4">
          Each game features unique scoring challenges that change with every play, 
          ensuring endless replayability and strategic variety.
        </p>
      </div>
    </>
  );
}