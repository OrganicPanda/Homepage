import React, { useContext } from "react"
import styled, { ThemeContext } from "styled-components"
import { Link, P } from "../components/typography"
import Layout from "../components/layout"
import Header from "../components/header"
import SEO from "../components/seo"
import Panda from "../components/panda"

const IndexPageWrapperStyled = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const HeaderStyled = styled(Header)`
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0 0 1em 0;
`

const NavStyled = styled.nav`
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0 0 1em 0;
`

const HRStyled = styled.hr`
  border: 0;
  height: 0;
  flex-shrink: 0;
  flex-grow: 0;
  width: 100%;
  border-bottom: 0.1em solid ${({ theme }) => theme.palette.headline};
  margin: 0 0 1em 0;
`

const ContentStyled = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.section1.background};
`

const PandaWrapperStyled = styled.div`
  max-width: 20em;
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 1em;
`

const Index = () => {
  const themeContext = useContext(ThemeContext)

  return (
    <>
      <SEO title="home" />

      <IndexPageWrapperStyled>
        <HeaderStyled />

        <HRStyled />

        <NavStyled>{/* <Link to="/2020/">2020</Link> */}</NavStyled>

        <ContentStyled>
          <PandaWrapperStyled>
            <Panda background={themeContext.palette.section1.background} />
          </PandaWrapperStyled>
        </ContentStyled>
      </IndexPageWrapperStyled>
    </>
  )
}

const IndexPage = () => {
  return (
    <Layout>
      <Index />
    </Layout>
  )
}

export default IndexPage
