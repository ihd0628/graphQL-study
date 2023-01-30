import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import client from "../client";

const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      medium_cover_image
      rating
      isLiked @client
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 15px;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 28px;
`;

const Image = styled.div`
  width: 25%;
  height: 60%;
  background-color: transparent;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  border-radius: 7px;
`;

export default function Movie() {
  const { id } = useParams();
  console.log(typeof id);
  const {
    data,
    loading,
    client: { cache },
  } = useQuery(GET_MOVIE, {
    variables: {
      movieId: id,
    },
  });
  const onClick = () => {
    cache.writeFragment({
      // <- 캐시안으로가서 캐시를 수정한겨 그러면 Apollo client는 isLiked의 변경사항을 듣는 모든것들을 새로고침 한다.
      id: `Movie:${id}`,
      fragment: gql`
        fragment MovieFragment on Movie {
          title
          isLiked
        }
      `, //위에서 fragment에서 뭘 바꿀지 정의하고 아래에서 바꿀 값들을 정의해주는겨
      data: {
        title: "Hello",
        isLiked: !data.movie.isLiked,
      },
    });
  };
  return (
    <Container>
      <Column>
        <Title>{loading ? "Loading..." : `${data?.movie?.title}`}</Title>
        <Subtitle>⭐️ {data?.movie?.rating}</Subtitle>
        <button onClick={onClick}>
          {data?.movie?.isLiked ? "Unlike" : "Like"}
        </button>
      </Column>
      <Image bg={data?.movie?.medium_cover_image} />
    </Container>
  );
}
