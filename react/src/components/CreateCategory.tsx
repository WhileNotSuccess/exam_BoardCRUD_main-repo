interface categoryBanner {
  key: number;
  boardName: string;
  categoryChange : (boardName:string) => void;
}


export const CreateCategory : React.FC<categoryBanner> = ({ boardName, categoryChange  }) => {
  
  const CategoryButton = () => {
    categoryChange(boardName);
  };

  return (
    <div className="line-change">
      <span onClick={CategoryButton}>
        {boardName}
        <br />
      </span>
    </div>
  );
};
