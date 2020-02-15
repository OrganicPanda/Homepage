import { Link as GatsbyLink } from "gatsby"
import styled from "styled-components"

export const H1 = styled.h1`
  color: ${({ theme }) => theme.palette.headline};
  font-size: 3rem;
  font-weight: 200;
  margin: -0.2em 0 0 0;
`

export const P = styled.p`
  color: ${({ theme }) => theme.palette.paragraph};
`

export const Link = styled(GatsbyLink)`
  color: ${({ theme }) => theme.palette.link};
`
