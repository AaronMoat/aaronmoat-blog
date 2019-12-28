import React from 'react';
import kebabCase from 'lodash/kebabCase';
import { Link } from 'gatsby';

import { rhythm } from '../utils/typography';

const Post = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug;

  return (
    <article>
      <header>
        <h3
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
            {title}
          </Link>
        </h3>
        <small>
          {node.frontmatter.date} | Tags:{' '}
          {node.frontmatter.tags.map((tag, i, tags) => (
            <span key={tag}>
              <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>{' '}
            </span>
          ))}
        </small>
      </header>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: node.frontmatter.description || node.excerpt,
          }}
        />
      </section>
    </article>
  );
};

export default Post;
