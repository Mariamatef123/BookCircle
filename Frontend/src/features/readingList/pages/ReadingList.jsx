import { styles } from "../../../styles/readingListStyles";
import useReadingList from "../hooks/useReadingList";
import { getUser } from "../../../utils/auth";

import ListTable      from "../components/ListTable";
import BooksTable     from "../components/BooksTable";
import CreateListModal from "../components/CreateListModal";
import AddBookModal   from "../components/AddBookModal";

export default function ReadingList() {
  const user   = getUser();
  const userId = user?.id;

  const rl = useReadingList(userId);

  return (
    <div style={styles.wrapper}>


      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Reading Lists</h1>
          <p style={styles.sub}>Manage your curated book collections</p>
        </div>
        {rl.activeTab === "lists" && (
          <button style={styles.btnPrimary} onClick={() => rl.setCreateModalOpen(true)}>
            + New List
          </button>
        )}
        {rl.activeTab === "books" && (
          <button style={styles.btnPrimary} onClick={() => rl.setAddBookModalOpen(true)}>
            + Add Book
          </button>
        )}
      </div>

      <div style={styles.tabBar}>
        {["lists", "books"].map((tab) => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(rl.activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => rl.setActiveTab(tab)}
          >
            {tab === "lists" ? "My Lists" : "Books in List"}
          </button>
        ))}
      </div>

      {rl.activeTab === "lists" && (
        <ListTable
          lists={rl.lists}
        
          onDelete={rl.removeList}
          onView={(id) => { rl.setSelectedListId(id); rl.setActiveTab("books"); }}
        />
      )}

      {rl.activeTab === "books" && (
        <BooksTable
          books={rl.books}
          lists={rl.lists}
          selectedListId={rl.selectedListId}
          onSelect={rl.setSelectedListId}
          onRemove={rl.removeBookFromList}
        />
      )}

   
      <CreateListModal
        createModalOpen={rl.createModalOpen}
        setCreateModalOpen={rl.setCreateModalOpen}
        newListName={rl.newListName}
        setNewListName={rl.setNewListName}
        newListDesc={rl.newListDesc}
        setNewListDesc={rl.setNewListDesc}
        createNewList={rl.createNewList}
      />

      <AddBookModal
        addBookModalOpen={rl.addBookModalOpen}
        filterType={rl.filterType}
        setFilterType={rl.setFilterType}
        filterValue={rl.filterValue}
        setFilterValue={rl.setFilterValue}
        searching={rl.searching}
        searchError={rl.searchError}
        setSearchError={rl.setSearchError}
        results={rl.results}
        addBookToList={rl.addBookToList}
        closeAddModal={rl.closeAddModal}
      />

    </div>
  );
}
