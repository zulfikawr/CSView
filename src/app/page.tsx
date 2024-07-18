import Table from "./table/table";

const Home = () => {
  return (
    <main className="flex-1 max-w-3xl md:max-w-screen-xl md:mx-auto">
      <section className="md:container px-3 relative">
        <div className="mx-auto py-8 md:py-12 md:pb-8 lg:py-12 lg:pb-10">
          <Table />
        </div>
      </section>
    </main>
  );
};
export default Home;