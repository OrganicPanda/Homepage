import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Panda from "../components/panda"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />

    <Panda />

    <Link to="/2020/">2020</Link>
  </Layout>
)

export default IndexPage
