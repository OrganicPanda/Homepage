import React from "react"
import styled from "styled-components"
import { Link, useStaticQuery, graphql } from "gatsby"
import { H1 } from "./typography"

const H1Styled = styled(H1)``

const LinkStyled = styled(Link)`
  text-decoration: none;

  :visited,
  :active,
  :hover {
    color: inherit;
  }
`

const Header = ({ className }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <header className={className}>
      <H1Styled>
        <LinkStyled to="/">{data.site.siteMetadata.title}</LinkStyled>
      </H1Styled>
    </header>
  )
}

export default Header
