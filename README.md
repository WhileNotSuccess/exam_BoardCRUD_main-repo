# exam_BoardCRUD_main-repo
실행방법
1. 해당 리포지토리를 클론한다
2. docker가 윈도우에서 실행중인지 확인한다
3. docker compose up -d
4. 실행됐는지 확인한다.

댓글 css
- 화살표 유압프레스에 눌림
- 댓글이랑 작성자가 너무 사이가 좋음
- 대댓글 안 보임
post css
- 카테고리 짜부됨
post, comment 페이지네이션
- 반환 url이 이상함
post지울때, comment도 하나하나 지우는데, 그때 작성자를 확인하는 바람에 에러가 남
- LHscommentmove 만드세요, 배열줘서 한번에 다 지우게 하기

pagination에서 postPerPage안 쓰니까, 불러오는 쪽에서도, Pagination.tsx 파일 안에서도 수정하기

Post.tsx에서 onclick 안의 boardName 파라미터 가 필요한가?

Listin.tsx 에서 commentOn, confirm 합치기

CategoryComp.tsx의 fetchCategories랑 useEffect 합치기

Comment.tsx의 
getNestedComment, useEffect 합치기

각자 페이지 설명 작성 ppt로
