import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  color: ${theme.colors.white};
  padding: 16px;
`;

export const s_content = css`
  display: grid;
  grid-template-columns: 2fr 1fr;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const s_infoContainer = css`
  display: flex;
  flex-direction: column;
  gap: 10px; /* Add spacing between elements */
  padding: 15px;
  margin-top: 10px;
  background: #f7f7f7; /* Light background for contrast */
  border-radius: 8px;
  border: 1px solid #ddd;

  .music-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #222;
  }

  .artist-list {
    display: flex;
    flex-wrap: wrap; /* Handle multiple artists gracefully */
    gap: 8px;
    font-size: 1.2rem;
    color: #555;
  }

  .artist {
    cursor: pointer;
    transition: color 0.3s ease;
    :hover {
      color: #1db954; /* Spotify green for hover */
      text-decoration: underline;
    }
  }

  .release-date {
    font-size: 1rem;
    color: #888;
    margin-top: 5px;
  }
`;
