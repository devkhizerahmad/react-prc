import Header from "../compenents/layout/Header";
import CardGrid from "../compenents/sections/CardGrid";


function Cards() {
  return (
    <>
      <Header />

      <main>
        <section className="section">
          <h1>Cards</h1>
          <CardGrid />
        </section>
      </main>
    </>
  );
}

export default Cards;
