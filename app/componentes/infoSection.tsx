export default function InfoSection() {
  return (
    <section className="relative bg-[#333] pb-20">
      <div className="max-w-5xl mx-auto relative">
        
        <div className="bg-white p-10 shadow-lg relative z-10 w-[70%]">
          <h3 className="font-semibold mb-4">A Subtitle</h3>
          <p className="text-sm text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
        </div>

        <div className="absolute right-0 top-10 w-[50%] h-[250px] bg-gray-200 border">
          {/* Imagen aquí */}
        </div>

      </div>
    </section>
  );}