<?php


namespace App\Extension\Doctrine;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;

/**
 * Class MatchAgainstV2
 * @package App\Extension\Doctrine
 *
 */
class MatchAgainst extends FunctionNode
{
    /**
     * @var array list of \Doctrine\ORM\Query\PathExpression
     */
    protected $pathExp = null;

    /**
     * @var string
     */
    protected $against = null;

    /**
     * @var bool
     */
    protected $booleanMode = false;

    protected $queryExpansion = false;

    public function parse(\Doctrine\ORM\Query\Parser $parser)
    {
        // Match
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(lexer::T_OPEN_PARENTHESIS);

        // First Path Expression is mandatory
        $this->pathExp = [];
        $this->pathExp[] = $parser->StateFieldPathExpression();

        //Subsquent Path Expression are optional
        $lexer = $parser->getLexer();

        while($lexer->isNextToken(Lexer::T_COMMA))
        {
            $parser->match(Lexer::T_COMMA);
            $this->pathExp[] = $parser->StateFieldPathExpression();
        }

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);

        // Against
        if(strtolower($lexer->lookahead['value']) !== "against")
        {
            $parser->syntaxError("against");
        }

        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->against = $parser->StringPrimary();

        if(strtolower($lexer->lookahead['value']) === "expand")
        {
            $parser->match(Lexer::T_IDENTIFIER);
            $this->queryExpansion = true;
        }

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);

    }

    public function getSql(\Doctrine\ORM\Query\SqlWalker $sqlWalker)
    {
        $fields = [];

        foreach($this->pathExp as $pathExp)
        {
            $fields[] = $pathExp->dispatch($sqlWalker);
        }

        $against = $sqlWalker->walkStringPrimary($this->against)
            .($this->booleanMode ? 'IN BOOLEAN MODE' : '')
            .($this->queryExpansion ? ' WITH QUERY EXPANSION' : '');

        return sprintf(
            'MATCH (%s) AGAINST (%s)',
            implode(', ', $fields),
            $against
        );

    }


}
