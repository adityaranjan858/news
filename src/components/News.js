import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {
  static defaultProps = {
    pageSize: 8,
    country: "in"
  }
  static propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsApp`;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=b1598044fd8f4261846ae61e52546b26&page=${this.state.page}&pageSize=${this.props.pageSize}`
    this.setState({ loading: true })
    let data = await fetch(url);
    let promisedData = await data.json();
    this.setState({
      articles: promisedData.articles,
      totalResults: promisedData.totalResults,
      loading: false
    })
  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePreviousPage = async () => {
    this.setState({
      page: this.state.page - 1
    });
    this.updateNews();
  }

  handleNextPage = async () => {
    this.setState({
      page: this.state.page + 1
    });
    this.updateNews();
  }

  render() {
    return (
      <>
        <div className='container my-5'>
          <h2 className='mb-4 text-center'>NewsApp - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
          {this.state.loading && <Spinner />}
          <div className="row">
            {!this.state.loading && this.state.articles.map((element) => {
              return <div className="col-md-4 my-3" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} date={element.publishedAt} author={element.author ? element.author : "Unknown"} source={element.source.name} />
              </div>
            })}
          </div>
          <div className='d-flex justify-content-between'>
            <button disabled={this.state.page <= 1} onClick={this.handlePreviousPage} className='btn btn-dark'>&laquo; Previous</button>
            <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} onClick={this.handleNextPage} className='btn btn-dark'>Next &raquo;</button>
          </div>
        </div>
      </>
    )
  }
}

export default News;